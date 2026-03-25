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
	supSignatureFile: File | null;
	supSignaturePreview: string | null;
	supSignatureUrlDelete: string | null;
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
		supSignatureFile: null,
		supSignaturePreview: user?.sup_signature_url || null,
		supSignatureUrlDelete: null,
	});

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "intern" | "supervisor",
	) => {
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

			const reader = new FileReader();
			reader.onloadend = () => {
				if (type === "intern") {
					setProfileState((prev) => ({
						...prev,
						signatureFile: file,
						signaturePreview: reader.result as string,
						signatureUrlDelete:
							user?.signature_url && !prev.signatureUrlDelete
								? user.signature_url
								: prev.signatureUrlDelete,
					}));
				} else {
					setProfileState((prev) => ({
						...prev,
						supSignatureFile: file,
						supSignaturePreview: reader.result as string,
						supSignatureUrlDelete:
							user?.sup_signature_url && !prev.supSignatureUrlDelete
								? user.sup_signature_url
								: prev.supSignatureUrlDelete,
					}));
				}
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
			user.sup_signature_url,
			profileState.supSignatureFile,
			profileState.supSignatureUrlDelete,
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
				supSignatureFile: null,
				supSignaturePreview: user.sup_signature_url || null,
				supSignatureUrlDelete: null,
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
						Update your name and signatures.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="grid gap-5 py-4">
					{/* Full Name */}
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

					{/* Signatures Grid */}
					<div className="grid grid-cols-2 gap-4">
						{/* Intern Signature */}
						<div className="grid gap-2">
							<Label>Your Signature</Label>
							<input
								type="file"
								id="signature"
								onChange={(e) => handleFileChange(e, "intern")}
								accept=".jpg,.jpeg,.png"
								className="hidden"
							/>
							<label
								htmlFor="signature"
								className="relative h-24 border border-dashed border-border rounded bg-white overflow-hidden cursor-pointer hover:border-primary transition-colors block"
							>
								{profileState.signaturePreview ? (
									<Image
										src={profileState.signaturePreview}
										alt="Your Signature"
										fill
										className="object-contain p-2"
									/>
								) : (
									<span className="flex items-center justify-center h-full text-xs text-muted-foreground">
										Click to attach
									</span>
								)}
							</label>
						</div>

						{/* Supervisor Signature */}
						<div className="grid gap-2">
							<Label>Supervisor Signature</Label>
							<input
								type="file"
								id="sup-signature"
								onChange={(e) => handleFileChange(e, "supervisor")}
								accept=".jpg,.jpeg,.png"
								className="hidden"
							/>
							<label
								htmlFor="sup-signature"
								className="relative h-24 border border-dashed border-border rounded bg-white overflow-hidden cursor-pointer hover:border-primary transition-colors block"
							>
								{profileState.supSignaturePreview ? (
									<Image
										src={profileState.supSignaturePreview}
										alt="Supervisor Signature"
										fill
										className="object-contain p-2"
									/>
								) : (
									<span className="flex items-center justify-center h-full text-xs text-muted-foreground">
										Click to attach
									</span>
								)}
							</label>
						</div>
					</div>

					<p className="text-xs text-muted-foreground">
						Max 3MB per file. Supported formats: JPG, PNG.
					</p>
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
