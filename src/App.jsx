import { useViewMode, VIEW_MODES } from './hooks/useViewMode'
import PortholeView from './views/PortholeView'
import FlatView from './views/FlatView'

export default function App() {
  const { mode, chooseMode, reducedMotion } = useViewMode()

  if (mode === VIEW_MODES.flat) {
    return <FlatView onResume={() => chooseMode(VIEW_MODES.porthole)} />
  }

  return (
    <PortholeView
      reducedMotion={reducedMotion}
      onAbort={() => chooseMode(VIEW_MODES.flat)}
    />
  )
}
