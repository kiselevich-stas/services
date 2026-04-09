export interface HockeyTeam {
  id: number
  khlId: number
  name: string
  location: string
  image: string
  division: string | null
  conference: string | null
}

export interface HockeyStage {
  id: number
  khlId: number
  title: string
  type: string
  season: string
}