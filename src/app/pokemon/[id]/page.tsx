import PokemonDetail from '@/components/PokemonDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PokemonPage({ params }: PageProps) {
  const { id } = await params;
  return <PokemonDetail pokemonId={id} />;
}

export async function generateStaticParams() {
  // Generate static params for the first 151 Pokemon
  const paths = Array.from({ length: 151 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return paths;
}
