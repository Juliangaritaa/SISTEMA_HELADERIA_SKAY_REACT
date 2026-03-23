// src/features/ventas/components/VentaExitosaModal.tsx
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Divider,
} from "@nextui-org/react";
import { CheckCircle } from "lucide-react";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

interface Props {
    isOpen:       boolean;
    ventaExitosa: { ventaId: number; total: number; mensaje: string } | null;
    onClose:      () => void;
}

export function NuevaVentaModal({ isOpen, ventaExitosa, onClose }: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            classNames={{ base: "max-w-sm" }}
        >
            <ModalContent>
                {(onModalClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-center gap-2 pt-6 pb-2">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-green-600 font-bold text-lg">¡Venta Exitosa!</h3>
                        </ModalHeader>

                        <ModalBody className="gap-3 pb-2">
                            <p className="text-default-500 text-small text-center">
                                {ventaExitosa?.mensaje}
                            </p>

                            <Divider />

                            <div className="flex flex-col gap-2 bg-sky-50 rounded-xl p-3">
                                <div className="flex justify-between text-small">
                                    <span className="text-default-500">N° Venta</span>
                                    <span className="font-bold">#{ventaExitosa?.ventaId}</span>
                                </div>
                                <div className="flex justify-between text-small">
                                    <span className="text-default-500">Total cobrado</span>
                                    <span className="font-bold text-sky-500">
                                        {formatCurrency(ventaExitosa?.total ?? 0)}
                                    </span>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter className="pt-2">
                            <Button
                                className="bg-sky-400 text-white w-full font-semibold"
                                onPress={onModalClose}
                            >
                                Nueva Venta
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}