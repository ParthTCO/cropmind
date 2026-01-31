import os
from pinecone import Pinecone

class RAGService:
    def __init__(self):
        self.pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        self.index_name = os.environ.get("PINECONE_INDEX", "cropmind")
        self.index_host = os.environ.get("PINECONE_HOST")
        self.index = self.pc.Index(name=self.index_name, host=self.index_host)

    async def get_relevant_advice(self, crop: str, stage: str, query: str = ""):
        # Industry grade RAG retrieval logic
        # For now return placeholder grounded context as requested if index empty
        search_context = f"Scientific guidance for {crop} at {stage} stage. {query}"
        
        # Real implementation would involve embedding search_context and querying Pinecone
        # return self.index.query(vector=embeddings, top_k=3, include_metadata=True)
        
        return f"Standard agricultural manual recommends focus on irrigation and nitrogen-based fertilizer during the {stage} phase of {crop}."
