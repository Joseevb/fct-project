import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/ui/Login";
import Register from "@/components/ui/Register";
import { useEffect, useState } from "react";
import OtpValidation from "@/components/ui/OtpValidation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<Login />
					</TabsContent>
					<TabsContent value="register">
						<Register setIsOtp={setIsOtp} />
					</TabsContent>
				</Tabs>
			)}
		</section>
	);
}
