import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListPropertyWizard from "@/components/list-property/ListPropertyWizard";

export const metadata = {
  title: "List your property, Haven Properties",
  description: "Landlords and owners: submit a property for rent or sale. Our team verifies the title before it goes live.",
};

// Landlord onboarding. Submissions are saved as hidden drafts for staff review.
export default function ListPropertyPage() {
  return (
    <>
      <Nav />
      <main className="container-x pb-[4.5rem] pt-28">
        <ListPropertyWizard />
      </main>
      <Footer />
    </>
  );
}
