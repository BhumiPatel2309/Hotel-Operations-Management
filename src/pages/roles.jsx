import { Helmet } from 'react-helmet-async';

import { RolesView } from '../sections/roles/view';

// ----------------------------------------------------------------------

export default function RolesPage() {
  return (
    <>
      <Helmet>
        <title> Roles | Minimal UI </title>
      </Helmet>

      <RolesView />
    </>
  );
}
