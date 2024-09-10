import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { pinata } from "utils/config";

export const meta: MetaFunction = () => {
	return [
		{ title: "Remix + Pinata" },
		{ name: "description", content: "Upload files on Remix with Pinata!" },
	];
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formDataFile = await request.formData();
	const file = formDataFile.get("file") as File;
	console.log(file);
	const { cid } = await pinata.upload.file(file);
	const url = await pinata.gateways.createSignedURL({
		cid: cid,
		expires: 60,
	});

	return json({ url });
};

export default function Index() {
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<div className="font-sans p-4 flex flex-col gap-4 justify-center items-center min-h-screen max-w-[500px] mx-auto">
			<h1 className="text-3xl font-bold">Remix + Pinata</h1>
			<Form
				encType="multipart/form-data"
				method="post"
				className="flex flex-col gap-4"
			>
				<input type="file" name="file" className="" />
				<button
					className="bg-[#582CD6] text-white rounded-md p-2"
					type="submit"
				>
					{isSubmitting ? "Uploading..." : "Upload"}
				</button>
			</Form>
			{actionData?.url && (
				<div className="mt-4">
					<a
						href={actionData.url}
						target="_blank"
						rel="noreferrer"
						className="text-[#582CD6] underline"
					>
						{actionData.url}
					</a>
				</div>
			)}
		</div>
	);
}
