"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/services/csr/users/update-profile";
import { supabaseBrowser } from "@/lib/supabase/client";
import Image from "next/image";
import { User } from "lucide-react";
import { LoadingButtonText } from "@/components/ui/loading-button-text";
import { UserSelect } from "@/lib/types";
type ProfileState = {
	name: string;
	signatureFile: File | null;
	signaturePreview: string | null;
	signatureUrlDelete: string | null;
};

type ProfileDialogProps = {
	user: UserSelect | null;
	refreshUser: () => Promise<void>;
	showAlert: (status: number, message: string) => void;
};

export function ProfileDialog({
	user,
	refreshUser,
	showAlert,
}: ProfileDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [profileState, setProfileState] = useState<ProfileState>({
		name: user?.fullname || "",
		signatureFile: null,
		signaturePreview: user?.signature_url || null,
		signatureUrlDelete: null,
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
			if (!allowedTypes.includes(file.type)) {
				showAlert(400, "Please select a JPG or PNG image file.");
				return;
			}

			const maxSize = 3 * 1024 * 1024;
			if (file.size > maxSize) {
				showAlert(400, "File size must be less than 3MB.");
				return;
			}

			setProfileState((prev) => ({
				...prev,
				signatureFile: file,
				signatureUrlDelete:
					user?.signature_url && !prev.signatureUrlDelete
						? user.signature_url
						: prev.signatureUrlDelete,
			}));
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileState((prev) => ({
					...prev,
					signaturePreview: reader.result as string,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		if (!user) return;

		if (!profileState.name.trim()) {
			showAlert(400, "Name cannot be empty.");
			return;
		}

		await updateProfile(
			supabaseBrowser,
			user.user_id,
			profileState.name,
			user.signature_url,
			profileState.signatureFile,
			profileState.signatureUrlDelete,
			showAlert,
			setIsLoading,
		);
		refreshUser();
	};

	const handleOpenChange = () => {
		if (user) {
			setProfileState({
				name: user.fullname || "",
				signatureFile: null,
				signaturePreview: user.signature_url || null,
				signatureUrlDelete: null,
			});
		}
	};

	return (
		<AlertDialog onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<User className="h-4 w-4" />
					Edit Profile
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Edit Profile</AlertDialogTitle>
					<AlertDialogDescription>
						Update your name and signature.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							value={profileState.name}
							onChange={(e) =>
								setProfileState((prev) => ({ ...prev, name: e.target.value }))
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="signature">Signature</Label>
						<div>
							<Input
								id="signature"
								type="file"
								onChange={handleFileChange}
								accept=".jpg,.jpeg,.png"
								title="Select a JPG or PNG image (max 3MB)"
							/>
							<p className="text-xs text-muted-foreground mt-2">
								Maximum file size: 3MB. Supported formats: JPG, PNG.
							</p>
							{profileState.signaturePreview && (
								<div className="mt-4 relative bg-white w-fit border border-border p-1 rounded">
									<Image
										src={profileState.signaturePreview}
										alt="Signature Preview"
										width={200}
										height={100}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<Button
						onClick={handleSubmit}
						disabled={isLoading}
						variant="default"
						className="bg-primary text-primary-foreground hover:bg-primary/90"
					>
						<LoadingButtonText
							isLoading={isLoading}
							title="Save Changes"
							loadingTitle="Saving Changes..."
						/>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
