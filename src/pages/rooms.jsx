import { Helmet } from 'react-helmet-async';

import { RoomsView } from '../sections/rooms/view';

// ----------------------------------------------------------------------

export default function RoomsPage() {
  return (
    <>
      <Helmet>
        <title> Rooms | Minimal UI </title>
      </Helmet>

      <RoomsView />
    </>
  );
}
