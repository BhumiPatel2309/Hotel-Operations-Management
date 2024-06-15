import { Helmet } from 'react-helmet-async';

import { PermissionsView } from '../sections/permissions/view';

// ----------------------------------------------------------------------

export default function PermissionsPage() {
  return (
    <>
      <Helmet>
        <title> Permissions | Minimal UI </title>
      </Helmet>

      <PermissionsView />
    </>
  );
}
