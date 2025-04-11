import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/ui/Login";
import Register from "@/components/ui/Register";

export default function AuthPage() {
    return (
        <section className="flex items-baseline justify-center min-h-dvh">
            <Tabs defaultValue="login" className="w-[400px] mt-9">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Login />
                </TabsContent>
                <TabsContent value="register">
                    <Register />
                </TabsContent>
            </Tabs>
        </section>
    );
}
