import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ErrorAlert {
	title: string;
	description: string;
	cancelText: string;
	actionText: string;
	defaultOpen: boolean;
	handleCancel: () => void;
	handleAction: () => void;
}

export default function ErrorAlert({
	title,
	description,
	cancelText,
	actionText,
	defaultOpen,
	handleCancel,
	handleAction,
}: Readonly<ErrorAlert>) {
	return (
		<AlertDialog defaultOpen={defaultOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => handleCancel()}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction onClick={() => handleAction()}>
						{actionText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
