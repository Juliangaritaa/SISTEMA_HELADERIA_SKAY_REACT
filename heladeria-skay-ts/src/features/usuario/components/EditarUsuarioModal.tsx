import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, Form,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package } from "lucide-react";
import { useEffect } from "react";
import { Usuario } from "../types/usuario.types";

const schema = z.object({
    nombreUsuario: z.string().min(1, "El nombre es obligatorio"),
    usuario: z.string().min(1, "Requerido"),
    rol: z.string().min(1, "Requerido"),
    activo: z.string().min(1, "Requerido"),
    email: z.string().email("Correo inválido").or(z.literal("")),
});

type EditarUsuarioForm = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    usuarios: Usuario | null;
    onEditar: (data: Usuario) => Promise<boolean>;
}

export function EditarUsuarioModal({ isOpen, onClose, onSuccess, usuarios, onEditar}: Props) {
    const {
        register, handleSubmit, control, reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<EditarUsuarioForm>({ resolver: zodResolver(schema) })

    useEffect(() => {
        if (usuarios) {
            reset({
                nombreUsuario: usuarios.nombreUsuario,
                usuario: usuarios.usuario,
                rol: String(usuarios.rol),
                activo: String(usuarios.activo),
                email: usuarios.email || "",
            });
        }
    }, [usuarios, reset]); 

    const onSubmit = async (data: EditarUsuarioForm) => {
        if (!usuarios) return;

        const payload: Usuario = {
            idUsuario: usuarios.idUsuario,
            nombreUsuario: data.nombreUsuario,
            usuario: data.usuario,
            rol: Number(data.rol),
            activo: data.activo === "true" || data.activo === "1",
            email: data.email,
        };

        const ok = await onEditar(payload);
        if (ok) {
            onSuccess();
            onClose();
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return(
        <Modal isOpen={isOpen} placement="top-center" onClose={handleClose} size="2xl"
            scrollBehavior="inside"
            classNames={{ base: "max-h-[100vh]", body: "overflow-y-auto" }}
        >
            <ModalContent>
                {(onModalClose) => (
                    <Form onSubmit={handleSubmit(onSubmit)}>

                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-sky-500 font-bold text-lg">Editar Usuarios</h3>
                            <p className="text-default-400 text-small font-normal">
                                Modifica los datos del Usuario
                            </p>
                        </ModalHeader>

                        <ModalBody className="w-full gap-4">

                            {/* NOMBRE */}
                            <Input
                                {...register("nombreUsuario")}
                                label="Nombre del usuario"
                                labelPlacement="outside"
                                placeholder="Ej: Julián Angarita"
                                variant="bordered"
                                isInvalid={!!errors.nombreUsuario}
                                errorMessage={errors.nombreUsuario?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                endContent={<Package size={18} className="text-default-400 pointer-events-none shrink-0" />}
                            />

                            <Input
                                {...register("usuario")}
                                label="Usuario"
                                labelPlacement="outside"
                                placeholder="Ej: Juliangaritaa"
                                variant="bordered"
                                isInvalid={!!errors.usuario}
                                errorMessage={errors.usuario?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                endContent={<Package size={18} className="text-default-400 pointer-events-none shrink-0" />}
                            />

                            <div className="flex gap-4">
                                <Select 
                                    {...register("rol")}
                                    label="Rol"
                                    variant="bordered"
                                    isInvalid={!!errors.rol}
                                >
                                    <SelectItem key="1" value="1">Administrador</SelectItem>
                                    <SelectItem key="2" value="2">Cajero</SelectItem>
                                </Select>
                            </div>
                            <Input
                                {...register("email")}
                                label="Correo Electrónico"
                                placeholder="ejemplo@correo.com"
                                isInvalid={!!errors.email}
                                errorMessage={errors.email?.message}
                                variant="bordered"
                            />
                            
                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" variant="flat" type="button" onPress={onModalClose}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="bg-sky-400 text-white"
                            >
                                Guardar Cambios
                            </Button>
                        </ModalFooter>

                    </Form>
                )}
            </ModalContent>
        </Modal>        
    );
}