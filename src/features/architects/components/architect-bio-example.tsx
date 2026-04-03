import { ArchitectBio } from "./architect-bio";
import { theodorWiederspahnMock } from "../mocks/architect-mock";

export default function ArchitectBioExample() {
  return (
    <main className="min-h-screen bg-[#151312] py-20">
      <div className="container mx-auto">
        {/* Exemplo com todos os dados (Mock) */}
        <ArchitectBio {...theodorWiederspahnMock} />

        {/* Exemplo minimalista */}
        <div className="mt-20 border-t border-[#4e4538]/20 pt-20">
          <h4 className="text-center text-[#efc173] mb-10 uppercase tracking-widest text-xs">
            Exemplo Minimalista
          </h4>
          <ArchitectBio 
            title="Oscar Niemeyer"
            bio="Oscar Ribeiro de Almeida Niemeyer Soares Filho foi um arquiteto brasileiro, considerado uma das figuras-chave no desenvolvimento da arquitetura moderna."
          />
        </div>
      </div>
    </main>
  );
}
