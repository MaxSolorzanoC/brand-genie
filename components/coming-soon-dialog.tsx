import { set } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
}

const ComingSoonDialog = ({ open, setOpen }: Props) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Coming Soon</DialogTitle>
                        <DialogDescription>
                            This feature is on development.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
    );
}
 
export default ComingSoonDialog;