import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Form,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, FileText } from "lucide-react";

const schema = z.object({
    monto: z.string().min(1, "El monto es obligatorio"),
    concepto: z.string().min(1, "El concepto es obligatorio"),
});
type FormData = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: ()=> void;
    onRegistrar: (monto: number, concepto: string) => Promise<boolean>;
}

export function EgresoCajaModal( {isOpen, onClose, onRegistrar}: Props) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        const ok = await onRegistrar(parseFloat(data.monto), data.concepto);
        if (ok) { reset(); onClose(); }
    };

    return (
        <Modal isOpen={isOpen} placement="top-center" onClose={() => { reset(); onClose(); }}>
            <ModalContent>
                {(onModalClose) => (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-sky-500 font-bold">Registrar Egreso Caja</h3>
                            <p className="text-default-400 text-small font-normal">
                                Registrar un egreso de la caja actual
                            </p>
                        </ModalHeader>
                        <ModalBody className="w-full">
                            <Input
                                {...register("monto")}
                                label="Monto"
                                labelPlacement="outside"
                                placeholder="Ej: 500.000"
                                type="number"
                                variant="bordered"
                                isInvalid={!!errors.monto}
                                errorMessage={errors.monto?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                startContent={<DollarSign size={16} className="text-default-400 shrink-0" />}
                            />
                            <Input
                                {...register("concepto")}
                                label="Concepto"
                                labelPlacement="outside"
                                placeholder="Ej: Compra de insumos"
                                type="text"
                                variant="bordered"
                                isInvalid={!!errors.concepto}
                                errorMessage={errors.concepto?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                startContent={<FileText size={16} className="text-default-400 shrink-0" />}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onModalClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" isLoading={isSubmitting} className="bg-sky-400 text-white">
                                Registrar Egreso
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </ModalContent>
        </Modal>
    );
}