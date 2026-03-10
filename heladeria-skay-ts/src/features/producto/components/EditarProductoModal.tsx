import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, Form,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, DollarSign, Hash, Calendar, Tag, Image } from "lucide-react";
import { useEffect } from "react";
import { useCategoria } from "../../categoria/hooks/useCategoria";
import { Producto } from "../types/producto.type";

const schema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    precioProducto: z.string().min(1, "Requerido"),
    precioCompraProducto: z.string().min(1, "Requerido"),
    stockProducto: z.string().min(1, "Requerido"),
    fechaVencimiento: z.string().min(1, "Requerido"),
    idCategoria: z.string().min(1, "Selecciona una categoría"),
    imagen: z.instanceof(FileList).optional(),
});

type EditarProductoForm = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    producto: Producto | null;
    onEditar: (formData: FormData) => Promise<boolean>;
}

export function EditarProductoModal({ isOpen, onClose, onSuccess, producto, onEditar}: Props) {
    const { categoria, isLoading: loadingCategorias} = useCategoria();

    const {
        register, handleSubmit, control, reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<NuevoProductoForm>({ resolver: zodResolver(schema) })

    useEffect(() => {

    reset({
        nombre:               producto.nombreProducto,
        precioProducto:       String(producto.precioProducto),
        precioCompraProducto: String(producto.precioCompraProducto),
        stockProducto:        String(producto.stockProducto),
        fechaVencimiento:     producto.fechaVencimientoProducto
                                ? producto.fechaVencimientoProducto.split("T")[0]
                                : undefined,
        idCategoria:          String(producto.idCategoria),
    });

    }, [producto]); 

    const onSubmit = async (data: EditarProductoForm) => {
        if (!producto) return;

        const formData = new FormData();
        formData.append("idProducto", String(producto.idProducto));
        formData.append("nombre", data.nombre);
        formData.append("precioProducto", data.precioProducto);
        formData.append("precioCompraProducto", data.precioCompraProducto);
        formData.append("stockProducto", data.stockProducto);
        formData.append("fechaVencimiento", data.fechaVencimiento);
        formData.append("idCategoria", data.idCategoria);
        formData.append("imagenActual", data.imagen);

        if (data.imagen && data.imagen.length > 0) {
            formData.append("imagen", data.imagen[0]);
        }

        const ok = await onEditar(formData);
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
                            <h3 className="text-sky-500 font-bold text-lg">Editar Producto</h3>
                            <p className="text-default-400 text-small font-normal">
                                Modifica los datos del producto
                            </p>
                        </ModalHeader>

                        <ModalBody className="w-full gap-4">

                            {/* NOMBRE */}
                            <Input
                                {...register("nombre")}
                                label="Nombre del producto"
                                labelPlacement="outside"
                                placeholder="Ej: Helado de vainilla"
                                variant="bordered"
                                isInvalid={!!errors.nombre}
                                errorMessage={errors.nombre?.message}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500",
                                }}
                                endContent={<Package size={18} className="text-default-400 pointer-events-none shrink-0" />}
                            />

                            {/* PRECIOS */}
                            <div className="flex gap-3">
                                <Input
                                    {...register("precioCompraProducto")}
                                    label="Precio de compra"
                                    labelPlacement="outside"
                                    placeholder="Ej: 1000"
                                    type="number"
                                    variant="bordered"
                                    isInvalid={!!errors.precioCompraProducto}
                                    errorMessage={errors.precioCompraProducto?.message}
                                    classNames={{
                                        inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                        label: "text-sky-500",
                                    }}
                                    endContent={<DollarSign size={18} className="text-default-400 pointer-events-none shrink-0" />}
                                />
                                <Input
                                    {...register("precioProducto")}
                                    label="Precio de venta"
                                    labelPlacement="outside"
                                    placeholder="Ej: 5000"
                                    type="number"
                                    variant="bordered"
                                    isInvalid={!!errors.precioProducto}
                                    errorMessage={errors.precioProducto?.message}
                                    classNames={{
                                        inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                        label: "text-sky-500",
                                    }}
                                    endContent={<DollarSign size={18} className="text-default-400 pointer-events-none shrink-0" />}
                                />
                            </div>

                            {/* STOCK Y FECHA */}
                            <div className="flex gap-3">
                                <Input
                                    {...register("stockProducto")}
                                    label="Stock"
                                    labelPlacement="outside"
                                    placeholder="Ej: 20"
                                    type="number"
                                    variant="bordered"
                                    isInvalid={!!errors.stockProducto}
                                    errorMessage={errors.stockProducto?.message}
                                    classNames={{
                                        inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                        label: "text-sky-500",
                                    }}
                                    endContent={<Hash size={18} className="text-default-400 pointer-events-none shrink-0" />}
                                />
                                <Input
                                    {...register("fechaVencimiento")}
                                    label="Fecha de vencimiento"
                                    labelPlacement="outside"
                                    type="date"
                                    variant="bordered"
                                    isInvalid={!!errors.fechaVencimiento}
                                    errorMessage={errors.fechaVencimiento?.message}
                                    classNames={{
                                        inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                        label: "text-sky-500",
                                    }}
                                    endContent={<Calendar size={18} className="text-default-400 pointer-events-none shrink-0" />}
                                />
                            </div>

                            {/* CATEGORÍA */}
                            <Controller
                                name="idCategoria"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Categoría"
                                        labelPlacement="outside"
                                        placeholder={loadingCategorias ? "Cargando..." : "Selecciona una categoría"}
                                        variant="bordered"
                                        isLoading={loadingCategorias}
                                        isDisabled={loadingCategorias}
                                        isInvalid={!!errors.idCategoria}
                                        errorMessage={errors.idCategoria?.message}
                                        classNames={{
                                            trigger: "border-sky-200 hover:border-sky-400 data-[focus=true]:border-sky-400",
                                            label: "text-sky-500",
                                        }}
                                        startContent={<Tag size={18} className="text-default-400 pointer-events-none shrink-0" />}
                                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                                        onSelectionChange={(keys) => field.onChange(Array.from(keys)[0]?.toString())}
                                    >
                                        {(categoria ?? []).map((cat) => (
                                            <SelectItem key={String(cat.idCategoria)}>
                                                {cat.nombreCategoria}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />

                            {/* IMAGEN */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sky-500 text-small">
                                    Nueva imagen <span className="text-default-400">(opcional — deja vacío para mantener la actual)</span>
                                </label>
                                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 border-sky-200 hover:border-sky-400">
                                    <Image size={18} className="text-default-400 shrink-0" />
                                    <input
                                        {...register("imagen")}
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-small text-default-500 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

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
                                Guardar Cambios
                            </Button>
                        </ModalFooter>

                    </Form>
                )}
            </ModalContent>
        </Modal>        
    );
}