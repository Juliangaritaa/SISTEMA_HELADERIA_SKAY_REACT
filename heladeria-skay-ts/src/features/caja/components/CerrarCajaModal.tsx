import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Form, Divider,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, AlertTriangle } from "lucide-react";
import { Caja } from "../types/caja.types";

const schema = z.object({
    efectivoContado: z.string().min(1, "El efectivo contado es obligatorio"),
});
type FormData = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: ()=> void;
    onCerrar: (efectivoContado: number) => Promise<boolean>;
    caja: Caja | null;
    totalEgresos: number;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

export function CerrarCajaModal({ isOpen, onClose, onCerrar, caja, totalEgresos}: Props) {
    const {
        register, handleSubmit, reset, watch, formState:{
            errors, isSubmitting
        }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const efectivoContado = parseFloat(watch("efectivooContado") || "0");
    const esperado = (caja?.montoInicial ?? 0) + (caja?.totalVentas ?? 0 - totalEgresos);
    const diferencia = efectivoContado - esperado;

    const onSubmit = async (data: FormData) => {
        const ok = await onCerrar(parseFloat(data.efectivoContado));
        if (ok) {
            reset();
            onClose();
        };
    };

    return (
        <Modal isOpen={isOpen} placement="top-center" onClose={() => { reset(); onClose(); }}>
            <ModalContent>
                {(onModalClose) => (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-sky-500 font-bold">Cerrar Caja</h3>
                            <p className="text-default-400 text-small font-normal">
                                Ingresa el efectivo contado para cerrar la caja
                            </p>
                        </ModalHeader>
                        <ModalBody className="w-full gap-4">

                            {/* resumen */}
                            <div className="flex flex-col gap-2 bg-sky-50 rounded-xl p-3">
                                <div className="flex justify-between text-small">
                                    <span className="text-default-500">Monto inicial</span>
                                    <span className="font-semibold">
                                        {formatCurrency(caja?.montoInicial ?? 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-small">
                                    <span className="text-default-500">Total ventas</span>
                                    <span className="font-semibold text-sky-500">
                                        {formatCurrency(caja?.totalVentas ?? 0)}
                                    </span>
                                </div>
                                <Divider />
                                <div className="flex justify-between text-small">
                                    <span className="font-bold">Esperado en caja</span>
                                    <span className="font-bold">{formatCurrency(esperado)}</span>
                                </div>
                            </div>

                            <Input
                                {...register("efectivoContado")}
                                label="Efectivo contado"
                                labelPlacement="outside"
                                placeholder="Ingresa el dinero contado"
                                type="number"
                                variant="bordered"
                                isInvalid={!!errors.efectivoContado}
                                errorMessage={errors.efectivoContado?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                startContent={<DollarSign size={16} className="text-default-400 shrink-0" />}
                            />

                            {/* diferencia */}
                            {efectivoContado > 0 && (
                                <div className={`flex items-center justify-between rounded-xl p-3 border ${
                                    diferencia >= 0
                                        ? "bg-green-50 border-green-200"
                                        : "bg-danger-50 border-danger-200"
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={16} className={diferencia >= 0 ? "text-green-500" : "text-danger"} />
                                        <span className={`text-small font-bold ${diferencia >= 0 ? "text-green-600" : "text-danger"}`}>
                                            {diferencia >= 0 ? "Sobrante" : "Faltante"}
                                        </span>
                                    </div>
                                    <span className={`text-small font-bold ${diferencia >= 0 ? "text-green-600" : "text-danger"}`}>
                                        {formatCurrency(Math.abs(diferencia))}
                                    </span>
                                </div>
                            )}

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onModalClose}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="bg-sky-400 text-white"
                            >
                                Cerrar Caja
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </ModalContent>
        </Modal>
    );
}