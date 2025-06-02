import { supabase } from "@/lib/supabase"

type Props = {
    url: string,
    downloadUrl: string,
}

export const downloadImage = async ({url, downloadUrl}: Props) => {
    const { data: blob, error } = await supabase
        .storage
        .from('images')
        .download(url)
    if(error) {
        console.error(error);
        return error;
    } 
    if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadUrl;
        a.click();
        URL.revokeObjectURL(url);
    }
}