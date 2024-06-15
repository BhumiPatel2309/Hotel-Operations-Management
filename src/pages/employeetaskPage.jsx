import { Helmet } from 'react-helmet-async';

import { Employeetask } from 'src/sections/employeetasks/view';

// ----------------------------------------------------------------------

export default function EmployeeTaskPage() {
  return (
    <>
      <Helmet>
        <title> Tasks | Minimal UI </title>
      </Helmet>

      <Employeetask />
    </>
  );
}
