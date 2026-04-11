export const START_RATING = 1500
export const K_FACTOR = 20
export const HOME_ADVANTAGE = 50

export type MatchEloPreview = {
    expectedHome: number
    expectedAway: number
    homeDeltaIfWin: number
    homeDeltaIfLoss: number
    awayDeltaIfWin: number
    awayDeltaIfLoss: number
}

export type PlayedMatchEloStats = {
    expectedHome: number
    expectedAway: number
    homeDelta: number
    awayDelta: number
}

export function getExpectedScore(homeRating: number, awayRating: number): number {
    const adjustedHome = homeRating + HOME_ADVANTAGE

    return 1 / (1 + 10 ** ((awayRating - adjustedHome) / 400))
}

export function calculateNextRatings(
    homeRating: number,
    awayRating: number,
    homeWon: boolean,
) {
    const expectedHome = getExpectedScore(homeRating, awayRating)
    const expectedAway = 1 - expectedHome

    const actualHome = homeWon ? 1 : 0
    const actualAway = homeWon ? 0 : 1

    const newHome = homeRating + K_FACTOR * (actualHome - expectedHome)
    const newAway = awayRating + K_FACTOR * (actualAway - expectedAway)

    return {
        expectedHome,
        expectedAway,
        newHome: Number(newHome.toFixed(2)),
        newAway: Number(newAway.toFixed(2)),
    }
}

export function getMatchEloPreview(
    homeRating: number,
    awayRating: number,
): MatchEloPreview {
    const expectedHome = getExpectedScore(homeRating, awayRating)
    const expectedAway = 1 - expectedHome

    const homeIfWin = homeRating + K_FACTOR * (1 - expectedHome)
    const homeIfLoss = homeRating + K_FACTOR * (0 - expectedHome)

    const awayIfWin = awayRating + K_FACTOR * (1 - expectedAway)
    const awayIfLoss = awayRating + K_FACTOR * (0 - expectedAway)

    return {
        expectedHome,
        expectedAway,
        homeDeltaIfWin: Number((homeIfWin - homeRating).toFixed(2)),
        homeDeltaIfLoss: Number((homeIfLoss - homeRating).toFixed(2)),
        awayDeltaIfWin: Number((awayIfWin - awayRating).toFixed(2)),
        awayDeltaIfLoss: Number((awayIfLoss - awayRating).toFixed(2)),
    }
}

export function getPlayedMatchEloStats(
    ratingHomeBefore: number,
    ratingAwayBefore: number,
    ratingHomeAfter: number,
    ratingAwayAfter: number,
): PlayedMatchEloStats {
    return {
        expectedHome: getExpectedScore(ratingHomeBefore, ratingAwayBefore),
        expectedAway: 1 - getExpectedScore(ratingHomeBefore, ratingAwayBefore),
        homeDelta: Number((ratingHomeAfter - ratingHomeBefore).toFixed(2)),
        awayDelta: Number((ratingAwayAfter - ratingAwayBefore).toFixed(2)),
    }
}