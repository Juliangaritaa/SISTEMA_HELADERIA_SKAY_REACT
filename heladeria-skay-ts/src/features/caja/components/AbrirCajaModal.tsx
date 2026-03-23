import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Form,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign } from "lucide-react";

const schema = z.object({
    montoInicial: z.string().min(1, "El monto inical es obligatorio"),
});
type FormData = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: ()=> void;
    onAbrir: (monto: number) => Promise<boolean>;
}

export function AbrirCajaModal( {isOpen, onClose, onAbrir}: Props) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        const ok = await onAbrir(parseFloat(data.montoInicial));
        if (ok) { reset(); onClose(); }
    };

    return (
        <Modal isOpen={isOpen} placement="top-center" onClose={() => { reset(); onClose(); }}>
            <ModalContent>
                {(onModalClose) => (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-sky-500 font-bold">Abrir Caja</h3>
                            <p className="text-default-400 text-small font-normal">
                                Ingresa el monto inicial para abrir la caja del día
                            </p>
                        </ModalHeader>
                        <ModalBody className="w-full">
                            <Input
                                {...register("montoInicial")}
                                label="Monto inicial"
                                labelPlacement="outside"
                                placeholder="Ej: 200.000"
                                type="number"
                                variant="bordered"
                                isInvalid={!!errors.montoInicial}
                                errorMessage={errors.montoInicial?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                startContent={<DollarSign size={16} className="text-default-400 shrink-0" />}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onModalClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" isLoading={isSubmitting} className="bg-sky-400 text-white">
                                Abrir Caja
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </ModalContent>
        </Modal>
    );
}