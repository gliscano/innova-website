import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Categorías y tags disponibles en el catálogo
const availableCategories = [
  "Pascuas",
  "Infantiles",
  "Mascotas",
  "Boho",
  "Escolar",
  "Fachadas",
  "Baby Shower",
  "Escaleras",
  "Personalizado",
]

const availableTags = [
  "pascuas",
  "celebración",
  "primavera",
  "niños",
  "infantil",
  "colorido",
  "mascotas",
  "animales",
  "pets",
  "boho",
  "elegante",
  "bohemio",
  "escolar",
  "educación",
  "estudiantes",
  "arquitectura",
  "urbano",
  "fachadas",
  "baby shower",
  "gender reveal",
  "bebé",
  "escaleras",
  "dinámico",
  "personalizado",
  "único",
  "custom",
]

export async function POST(request: Request) {
  try {
    const { searchTerm } = await request.json()

    if (!searchTerm || searchTerm.trim() === "") {
      return NextResponse.json({
        categories: [],
        tags: [],
        explanation: "No se proporcionó un término de búsqueda.",
      })
    }

    // Prompt para el modelo de IA
    const prompt = `
    Eres un asistente especializado en fotografía y diseño de fondos fotográficos.
    
    Basado en el siguiente término de búsqueda: "${searchTerm}"
    
    Determina cuáles de estas categorías son más relevantes (devuelve solo los nombres, máximo 3):
    ${availableCategories.join(", ")}
    
    Y cuáles de estos tags son más relevantes (devuelve solo los nombres, máximo 5):
    ${availableTags.join(", ")}
    
    También proporciona una breve explicación de por qué seleccionaste esas categorías y tags.
    
    Responde en formato JSON con esta estructura exacta:
    {
      "categories": ["categoria1", "categoria2"],
      "tags": ["tag1", "tag2", "tag3"],
      "explanation": "Breve explicación de la selección"
    }
    `

    // Generar respuesta con IA
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.3, // Valor bajo para respuestas más consistentes
      maxTokens: 500,
    })

    // Parsear la respuesta JSON
    try {
      const result = JSON.parse(text)
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error parsing AI response:", error)
      return NextResponse.json(
        {
          categories: [],
          tags: [],
          explanation: "Error al procesar la respuesta de IA.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json(
      {
        categories: [],
        tags: [],
        explanation: "Error en el servicio de búsqueda.",
      },
      { status: 500 },
    )
  }
}
