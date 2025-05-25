import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/ui/Login";
import { useEffect, useState } from "react";
import OtpValidation from "@/components/ui/OtpValidation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import RegisterWithAddress from "../ui/RegisterWithAddress";

export default function AuthPage() {
	const [isOtp, setIsOtp] = useState(false);

	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	return (
		<section className="flex items-baseline justify-center min-h-dvh">
			{isOtp ? (
				<OtpValidation setIsOtp={setIsOtp} />
			) : (
				<Tabs defaultValue="login" className="w-[400px] mt-9">
					<TabsList className="grid w-full grid-cols-2 bg-card">
						<TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
						<TabsTrigger value="register">Registrarse</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<Login />
					</TabsContent>
					<TabsContent value="register">
						<RegisterWithAddress setIsOtp={setIsOtp} />
					</TabsContent>
				</Tabs>
			)}
		</section>
	);
}
