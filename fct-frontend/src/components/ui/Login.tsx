import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import RouterLogger from "@/components/RouterLogger";

const formSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(20)
        .trim()
        .regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().nonempty().trim(),
});

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) navigate("/");

    // Get the path the user was trying to access
    const from = location.state?.from?.pathname || "/";

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            username: "",
            password: "",
        },
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError("");
        setIsLoading(true);

        try {
            await login(data.username, data.password);

            // Navigate to the page they were trying to access
            navigate(from, { replace: true });
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                console.log("Error", err.response);
                setError(
                    err.response?.data?.message ||
                    "Login failed. Please check your credentials.",
                );
            } else {
                setError("Unknown error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <RouterLogger componentName="Login Page" />
            <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                    Introduzca sus credenciales para acceder a su cuenta
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="post">
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de usuario</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Introduzca su nombre de usuario"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Introduzca su contraseña"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
