import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  status: 'idle' | 'processing' | 'success' | 'error',
  idSubject: string
}

export default function PaymentModal({ isOpen, onClose, status, idSubject }: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estado del Pago</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {status === 'processing' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              <p className="mt-4 text-lg text-gray-700 font-semibold">Estamos procesando tu pago...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="mt-4 text-lg text-green-700 font-semibold">¡Pago completado con éxito!</p>
              <p className="mt-4 text-sm text-gray-700 font-semibold">ID de la transacción: {idSubject}</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="mt-4 text-lg text-red-700 font-semibold">Ha ocurrido un error al procesar el pago.</p>
              <p className="mt-4 text-sm text-gray-700 font-semibold">ID de la transacción: {idSubject}</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}