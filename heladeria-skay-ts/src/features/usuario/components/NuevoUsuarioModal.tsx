import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, Form,
} from "@nextui-org/react";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Package, DollarSign, Hash, Calendar, Tag } from "lucide-react";
import { toast } from 'sonner';
import { useUsuario } from '../hooks/useUsuario';

const schema = z.object({
    nombreUsuario: z.string().min(1, "Requerido"),
    usuario: z.string().min(1, "Requerido"),
    password: z.string().min(6, "Minimo 6 caracteres."),
    rol: z.string().min(1, "Requerido"),
    email: z.email().min(1, "Correo inválido."),
})

type NuevoUsuarioForm = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NuevoUsuarioModal({ isOpen, onClose, onSuccess }: Props) {

    const {
        register, handleSubmit, control, reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<NuevoUsuarioForm>({ resolver: zodResolver(schema) })

    const { crearUsuario } = useUsuario();

    const onSubmit = async (data: NuevoUsuarioForm) => {
        try {
            const payload = {
            nombreUsuario: data.nombreUsuario,
            usuario: data.usuario,
            password: data.password,
            rol: Number(data.rol),
            activo: data.activo === "true" || data.activo === "1",
            email: data.email,
            };

            const result = await crearUsuario(payload);

            if (result) {
                onSuccess(); // Esta función suele ser 'fetchUsuarios' para refrescar la tabla
                reset();
                onClose();
            }

        } catch (error) {
            toast.error("Error al crear el usuario", {
              description: error instanceof Error ? error.message : String(error)
            });
            console.error("Erro al crear un usuario.");
        }
    }

    const handleClose = () => {
        reset();
        onClose();
    };

  return (
    <Modal isOpen={isOpen} placement="top-center" onClose={handleClose} size="2xl" scrollBehavior="inside" classNames={{ base: "max-h-[100vh]", body: "overflow-y-auto", }}>
      <ModalContent>
        {(onModalClose) => (
          <Form onSubmit={handleSubmit(onSubmit)}>

            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-sky-500 font-bold text-lg">Nuevo Usuario</h3>
              <p className="text-default-400 text-small font-normal">
                Completa los datos para registrar un nuevo usuario.
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

                <Input
                    {...register("password")}
                    label="Clave"
                    labelPlacement="outside"
                    variant="bordered"
                    type="password"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
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
              <Button color="danger" variant="flat" onPress={onModalClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-sky-400 text-white"
              >
                Crear Producto
              </Button>
            </ModalFooter>

          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}