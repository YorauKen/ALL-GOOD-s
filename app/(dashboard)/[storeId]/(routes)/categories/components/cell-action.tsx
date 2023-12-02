"use client";
import { useState } from "react";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { 
	DropdownMenu, 
	DropdownMenuContent, 
	DropdownMenuItem, 
	DropdownMenuLabel, 
	DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import Loading from "@/components/ui/loading";

interface CellActionProps {
	data:CategoryColumn
}

export const CellAction:React.FC<CellActionProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();
	const [loading,setLoading] = useState(false);
	const [open,setOpen] = useState(false);

	const onCopy = (id:string) => {
		navigator.clipboard.writeText(id);
		toast.success("Category Id Copied to Clipboard");
	}

	const onDelete = async () => {
		try {
		  setLoading(true);
		  await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
		  router.refresh();
		  toast.success("Category deleted.");
		} catch (error) {
			console.log(error);
		  toast.error("Make Sure you remove all products using this category");
		} finally {
		  setLoading(false);
		  setOpen(false);
		}
	  }

	return (
		<>
		<AlertModal 
			isOpen={open} 
			onClose={()=>setOpen(false)} 
			onConfirm={onDelete} 
			loading={loading}
		/>
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className="h-8 w-8 p-0" >
					<span className="sr-only">Open Menu</span>
					<MoreHorizontal className="h-4 w-4"/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					Actions
				</DropdownMenuLabel>
				<DropdownMenuItem onClick={()=>onCopy(data.id)} >
					<Copy className="w-4 h-4 mr-2"/>
					Copy Id
				</DropdownMenuItem>
				<DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/categories/${data.id}`)}>
					<Edit className="w-4 h-4 mr-2"/>
					Update
				</DropdownMenuItem>
				<DropdownMenuItem onClick={()=>setOpen(true)}>
					<Trash className="w-4 h-4 mr-2"/>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		{loading && <Loading/>}
	</>

	)
}