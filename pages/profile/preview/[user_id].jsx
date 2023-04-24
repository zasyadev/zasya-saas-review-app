import AdminLayout from "../../../component/layout/AdminLayout";
import Profile from "../../../component/Profile/Profile";
import WithMe from "../../../component/layout/WithMe";
import { useRouter } from "next/router";
import NoRecordFound from "../../../component/common/NoRecordFound";

function PreviewProfilePage() {
  const router = useRouter();

  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Profile"}>
          {router.query.user_id ? (
            <Profile user={router.query.user_id} previewMode />
          ) : (
            <NoRecordFound title={"No User Found"} />
          )}
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default PreviewProfilePage;
