import { motion } from 'framer-motion'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-8">

      {/* Bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="font-display text-4xl font-bold text-cocoa-800">
          ¡Bienvenido,{' '}
          <span className="italic text-gradient">{user?.nombreUsuario ?? 'Usuario'}</span>!
        </h1>
        <p className="text-cocoa-400 font-body text-sm">
          Has iniciado sesión correctamente en el sistema.
        </p>
      </motion.div>

    </div>
    )
}