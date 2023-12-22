import { auth } from "@clerk/nextjs";
import Dropzone from "@/components/Dropzone";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import TableWrapper from "@/components/table/TableWrapper";
import { File } from "@/lib/Converters/TeamFiles";

async function Dashboard() {
  const { userId } = auth();

  const docsResults = await getDocs(collection(db, "users", userId!, "files"));
  const skeletonFiles: File[] = docsResults.docs.map((doc) => ({
    id: doc.id,
    user: doc.data().user,
    filename: doc.data().filename || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    fullName: doc.data().fullName,
    downloadURL: doc.data().downloadURL,
    size: doc.data().size,
    type: doc.data().type,
  }));

  return (
    <div className="border-t">
      <h2 className="mt-5 font-bold container space-y-5 text-2xl">My Files</h2>
      <Dropzone />
      <section className="container space-y-5">
        <h2 className="font-bold">All Files</h2>
        <div>
          <TableWrapper skeletonFiles={skeletonFiles} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
