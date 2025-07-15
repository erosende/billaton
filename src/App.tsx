import { AppShell, NavLink, Title, Group, Image, Divider } from '@mantine/core'
import { useState } from 'react'
import { 
  FileText, 
  Users, 
  Building2
} from 'lucide-react'
import './App.css'

const App = () => {
  const [activeNav, setActiveNav] = useState('documents')

  const handleNavClick = (value: string) => {
    setActiveNav(value)
  }

  return (
    <AppShell
      navbar={{
        width: 200,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Group mb="xl">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <Image src="/billaton_logo.png" alt="Billaton" width={100} height={100} fit='contain' />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Title order={3}>BILL</Title>
              <Title order={3}>A</Title>
              <Title order={3}>TON</Title>
            </div>
            
          </div>
        </Group>

        <NavLink
          href="#"
          label="Documentos"
          leftSection={<FileText size={20} />}
          active={activeNav === 'documents'}
          onClick={() => handleNavClick('documents')}
          aria-label="Navegar a documentos"
          tabIndex={0}
        />

        <NavLink
          href="#"
          label="Clientes"
          leftSection={<Users size={20} />}
          active={activeNav === 'recipients'}
          onClick={() => handleNavClick('recipients')}
          aria-label="Navegar a clientes"
          tabIndex={0}
        />

        <NavLink
          href="#"
          label="Facturadores"
          leftSection={<Building2 size={20} />}
          active={activeNav === 'issuers'}
          onClick={() => handleNavClick('issuers')}
          aria-label="Navegar a facturadores"
          tabIndex={0}
        />

      </AppShell.Navbar>

      <AppShell.Main>
        <Title order={1} mb="lg" style={{ paddingLeft: '15px' }}>
          {activeNav === 'documents' && 'Documentos'}
          {activeNav === 'recipients' && 'Clientes'}
          {activeNav === 'issuers' && 'Facturadores'}
        </Title>
        <Divider />
        
        <div>
          {activeNav === 'documents' && (
            <p>Gestiona tus facturas y documentos de facturación aquí.</p>
          )}
          {activeNav === 'recipients' && (
            <p>Gestiona tus clientes y sus información.</p>
          )}
          {activeNav === 'issuers' && (
            <p>Gestiona tus facturadores y sus configuraciones.</p>
          )}
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
