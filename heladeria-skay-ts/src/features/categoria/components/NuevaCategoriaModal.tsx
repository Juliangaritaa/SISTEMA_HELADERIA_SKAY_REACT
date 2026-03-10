import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, Form,
} from "@nextui-org/react";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Package, DollarSign, Hash, Calendar, Tag, Image } from "lucide-react";
import { useCategoria } from "../../categoria/hooks/useCategoria";
import { toast } from 'sonner';
import { categoriaService } from '../services/categoria.services';

const schema = z.object({
    nombreCategoria: z.string().min(1, "El nombre es obligatorio."),
    descripcionCategoria: z.string().min(1, "La descripcion es obligatoria."),
})

type NuevaCategoriaForm = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NuevaCategoriaModal({ isOpen, onClose, onSuccess }: Props) {

    const { categoria, isLoading: loadingCategoria } = useCategoria();

    const {
        register, handleSubmit, control, reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<NuevaCategoriaForm>({ resolver: zodResolver(schema) })

const onSubmit = async (data: NuevaCategoriaForm) => {
    try {
        const formData = new FormData();
        formData.append("nombreCategoria", data.nombreCategoria);
        formData.append("descripcionCategoria", data.descripcionCategoria);

        const result = await categoriaService.create(formData); // ← service
        if (result.exito) {
            reset();
            onSuccess();
            onClose();
        }
    } catch (error) {
        console.error("Error al crear la categoria:", error);
    }
};

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
              <h3 className="text-sky-500 font-bold text-lg">Nueva Categoria</h3>
              <p className="text-default-400 text-small font-normal">
                Completa los datos para registrar una nueva categoria
              </p>
            </ModalHeader>

            <ModalBody className="w-full gap-4">

              {/* NOMBRE */}
              <Input
                {...register("nombreCategoria")}
                label="Nombre de la categoria."
                labelPlacement="outside"
                placeholder="Ej: Helado de vainilla"
                variant="bordered"
                isInvalid={!!errors.nombreCategoria}
                errorMessage={errors.nombreCategoria?.message}
                classNames={{
                  inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                  label: "text-sky-500",
                }}
                endContent={<Package size={18} className="text-default-400 pointer-events-none shrink-0" />}
              />

              {/* NOMBRE */}
              <Input
                {...register("descripcionCategoria")}
                label="Descripcion de la categoria."
                labelPlacement="outside"
                placeholder="Ej: Helado de vainilla"
                variant="bordered"
                isInvalid={!!errors.descripcionCategoria}
                errorMessage={errors.descripcionCategoria?.message}
                classNames={{
                  inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                  label: "text-sky-500",
                }}
                endContent={<Package size={18} className="text-default-400 pointer-events-none shrink-0" />}
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
                Crear Categoria
              </Button>
            </ModalFooter>

          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}