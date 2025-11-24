import StatusViewerCard from "./StatusViewerCard";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
type Props = {
  viewers: UserStatusType["viewers"];
};
const StatusViewersList = ({ viewers }: Props) => {
  const StatusViewersElements = [...viewers]
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .map((viewer) => (
      <StatusViewerCard key={viewer.user._id} viewer={viewer} />
    ));
  return (
    <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden">
      <DialogHeader>
        <DialogTitle>Viewed by {viewers.length}</DialogTitle>
      </DialogHeader>
      {viewers.length <= 0 ? (
        <div className="flex items-center justify-center p-12 text-gray-400">
          No views yet
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {StatusViewersElements}
        </div>
      )}
    </DialogContent>
  );
};

export default StatusViewersList;
