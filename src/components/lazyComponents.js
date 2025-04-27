import { lazy } from 'react'

// Heritage Detail Components
export const HeritageChat = lazy(() => import('~/pages/HeritageDetail/HeritageChat'))
export const LeaderboardTable = lazy(() => import('~/pages/HeritageDetail/LeaderboardTable/LeaderboardTable'))
export const HeritageKnowledgeTest = lazy(() => import('~/pages/HeritageDetail/HeritageKnowledgeTest/HeritageKnowledgeTest'))
export const HeritageDetailTabs = lazy(() => import('~/pages/HeritageDetail/HeritageDetailTab'))
export const HeritageFeatures = lazy(() => import('~/pages/HeritageDetail/HeritageFeatures'))
export const HeritageInfo = lazy(() => import('~/pages/HeritageDetail/HeritageInfo'))
export const HeritageHeader = lazy(() => import('~/pages/HeritageDetail/HeritageHeader'))

// Tab Components
export const HistoryTab = lazy(() => import('~/pages/HeritageDetail/tabs/HistoryTab'))
export const GalleryTab = lazy(() => import('~/pages/HeritageDetail/tabs/GalleryTab'))

// Pages
export const Heritages = lazy(() => import('~/pages/Heritages'))
export const Favorites = lazy(() => import('~/pages/Favorites'))
export const Profile = lazy(() => import('~/pages/Profile'))
export const Login = lazy(() => import('~/pages/Login'))
export const Register = lazy(() => import('~/pages/Register'))
export const EmailVerification = lazy(() => import('~/pages/EmailVerification'))
export const NotFound = lazy(() => import('~/pages/NotFound')) 