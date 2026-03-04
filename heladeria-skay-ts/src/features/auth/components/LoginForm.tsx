import { Card, CardHeader, CardBody, Input, Button, Form } from "@nextui-org/react";
import { Mail, Lock, IceCream } from "lucide-react";
import { useLogin } from "../hook/useLogin";

export function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();
  const { register, formState: { errors } } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <Card className="w-full max-w-md shadow-xl bg-white/80 backdrop-blur-md">

        <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-6">
          <div className="p-3 bg-sky-400 rounded-full mb-2">
            <IceCream className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-sky-500">Heladería Sky</h1>
          <p className="text-small text-default-400">Inicia sesión en tu cuenta</p>
        </CardHeader>

        <CardBody className="py-6">
          <Form
            className="flex flex-col gap-4"
            validationErrors={{
              correo: errors.correo?.message as string,
              clave: errors.password?.message as string,
            }}
            onSubmit={onSubmit}
          >
            <Input
              {...register('correo')}
              isRequired
              label="Correo electrónico"
              labelPlacement="outside"
              placeholder="tucorreo@email.com"
              type="email"
              variant="bordered"
              isInvalid={!!errors.correo}
              errorMessage={errors.correo?.message as string}
              classNames={{
                inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                label: "text-sky-500"
              }}
              startContent={
                <Mail size={18} className="text-sky-300 pointer-events-none flex-shrink-0" />
              }
            />

            <Input
              {...register('password')}
              isRequired
              label="Contraseña"
              labelPlacement="outside"
              placeholder="••••••••"
              type="password"
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
              classNames={{
                inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                label: "text-sky-500"
              }}
              startContent={
                <Lock size={18} className="text-sky-300 pointer-events-none flex-shrink-0" />
              }
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-sky-400 text-white hover:bg-sky-500 mt-2"
            >
              Entrar
            </Button>
          </Form>
        </CardBody>

      </Card>
    </div>
  );
}