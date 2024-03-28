import { createRoot } from 'react-dom/client'
import App from './components/App'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

window.Buffer = window.Buffer || require('buffer').Buffer

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <MantineProvider defaultColorScheme="dark">
    <App />
  </MantineProvider>
)
