import ProfileCard from './_components/profile-card';

function Layout({ tabs }) {
  return (
    <section className='relative pb-16'>
      <div className='container relative mt-10'>
        <ProfileCard tabs={tabs} />
      </div>
    </section>
  );
}

export default Layout;
