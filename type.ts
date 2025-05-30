export type Profile = {
    id: string;
    name: string;
    email: string;
    isPro: boolean;
    subscriptionId: string | null;
    customerId: string | null;
}

export type Project = {
    id: string,
    userId: string,
    name: string,
    description: string,
    slogan: string,
    logo: string | null,
}

export type Prompt = {
      audience: string,
      description: string,
      industry: string,
      temperature: number[]; 
}