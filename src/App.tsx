import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnalysisMenu } from '@/pages/AnalysisMenu'
import { Camera } from '@/pages/Camera'
import { Demographics } from '@/pages/Demographics'
import { ImageChoice } from '@/pages/ImageChoice'
import { Intro } from '@/pages/Intro'
import { Landing } from '@/pages/Landing'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/testing" element={<Intro />} />
        <Route path="/result" element={<ImageChoice />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/select" element={<AnalysisMenu />} />
        <Route path="/demographics" element={<Demographics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
