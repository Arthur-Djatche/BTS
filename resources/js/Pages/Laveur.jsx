import Layout from "@/Layouts/Layout";
import LayoutLaveur from "@/Layouts/LayoutLaveur";
function Laveur() {
    return (
        <LayoutLaveur>
            <h1> Laveur
             </h1>
        </LayoutLaveur>
    );
}

Laveur.layout = page => <Layout children={page}/>

export default Laveur;