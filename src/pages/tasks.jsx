import { Helmet } from 'react-helmet-async';

import { TasksView } from 'src/sections/tasks/view';

// ----------------------------------------------------------------------

export default function RoomsPage() {
  return (
    <>
      <Helmet>
        <title> Tasks | Minimal UI </title>
      </Helmet>

      <TasksView />
    </>
  );
}
