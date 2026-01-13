import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { contestService } from '@/services/contest.service'
import { lockService } from '@/services/lock.service'
import { Contest, ContestProblemWrapper } from '@/types/contest.types'
import { authService } from '@/services/auth.service'
import { User } from '@/types/api.types'

type ContestPhase = 'LOADING' | 'LOBBY' | 'LIVE' | 'ENDED'

export function useContestRoom() {
    const { id } = useParams()

    const [contest, setContest] = useState<Contest | null>(null)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [effectiveStartTime, setEffectiveStartTime] = useState<number | null>(null)
    const [phase, setPhase] = useState<ContestPhase>('LOADING')
    const [problems, setProblems] = useState<ContestProblemWrapper[]>([])
    const [isRegistered, setIsRegistered] = useState(false)
    const [loadingAction, setLoadingAction] = useState(false)

    const pollInterval = useRef<number>()

    useEffect(() => {
        if (!id || id === 'undefined') {
            console.error('Contest ID missing')
            return
        }

        if (authService.isAuthenticated()) {
            authService.getCurrentUser()
                .then(u => setCurrentUser(u))
                .catch(console.error)
        }

        loadContestData(id)
        return () => clearInterval(pollInterval.current)
    }, [id])

    useEffect(() => {
        if (!contest || !effectiveStartTime) return

        const tick = () => {
            const now = new Date().getTime()
            const end = new Date(contest.end_time).getTime()
            const start = effectiveStartTime

            if (now > end) {
                setPhase('ENDED')
            } else if (now >= start) {
                setPhase('LIVE')
            } else {
                setPhase('LOBBY')
            }
        }

        tick()
        pollInterval.current = window.setInterval(tick, 1000)
        return () => clearInterval(pollInterval.current)
    }, [contest, effectiveStartTime])

    useEffect(() => {
        if (phase === 'LIVE' && id && id !== 'undefined' && isRegistered) {
            contestService.getContestProblems(id)
                .then(setProblems)
                .catch(() => {})
        }
    }, [phase, id, isRegistered])

    const loadContestData = async (contestId: string) => {
        try {
            const data = await contestService.getContestById(contestId)

            let startTimeMs = 0
            if (data.start_time) {
                startTimeMs = new Date(data.start_time).getTime()
            } else if (data.lock_id) {
                try {
                    const lockData = await lockService.getLockById(data.lock_id)
                    if (lockData.lock_type === 'timer' && lockData.timeout) {
                        startTimeMs = new Date(lockData.timeout).getTime()
                    } else {
                        startTimeMs = new Date().getTime()
                    }
                } catch {}
            }

            setEffectiveStartTime(startTimeMs)
            setContest(data)

            if (data.is_published) {
                setIsRegistered(true)
            } else if (authService.isAuthenticated()) {
                try {
                    const myIds = await contestService.getMyRegisteredContestIds()
                    const isReg = myIds.some((val: any) =>
                        val === contestId || val?.contest_id === contestId || val?.id === contestId
                    )
                    setIsRegistered(isReg)
                } catch {}
            }
        } catch {
            setPhase('ENDED')
        }
    }

    const register = async () => {
        if (!contest) return

        if (!currentUser?.user_name) {
            alert('Please log in to register.')
            return
        }

        setLoadingAction(true)
        try {
            await contestService.registerForContest(
                contest.contest_id,
                currentUser.user_name
            )
            setIsRegistered(true)
            loadContestData(contest.contest_id)
        } catch (e: any) {
            const msg = e.response?.data?.message || e.message || 'Unknown error'
            alert('Registration Failed: ' + msg)
        } finally {
            setLoadingAction(false)
        }
    }

    const formatDuration = () => {
        if (!contest || !effectiveStartTime) return '--:--:--'

        const now = new Date().getTime()
        const end = new Date(contest.end_time).getTime()
        const target = phase === 'LOBBY' ? effectiveStartTime : end
        const diff = target - now

        if (diff <= 0) return 'Ended'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)

        if (days > 30) {
            const months = Math.floor(days / 30)
            const remDays = days % 30
            return `${months} Months ${remDays} Days`
        }

        if (days > 0) return `${days}d ${hours}h ${minutes}m`

        return `${hours.toString().padStart(2, '0')}h ${minutes
            .toString()
            .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
    }

    return {
        contest,
        phase,
        problems,
        isRegistered,
        loadingAction,
        register,
        timerDisplay: formatDuration()
    }
}

