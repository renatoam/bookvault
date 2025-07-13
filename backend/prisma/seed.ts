import { PrismaClient, BookStatus } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  const users = [
    {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'Password123!'
    },
    {
      id: 'user-2', 
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: 'Password123!'
    },
    {
      id: 'user-3',
      name: 'Pedro Oliveira', 
      email: 'pedro@example.com',
      password: 'Password123!'
    }
  ]

  // Create users with hashed passwords
  const createdUsers = []
  for (const userData of users) {
    const passwordHash = await hash(userData.password)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        passwordHash
      }
    })
    createdUsers.push(user)
    console.log(`👤 Created user: ${user.name} (${user.email})`)
  }

  // Books data with various authors and genres
  const booksData = [
    // Fiction
    { title: 'Dom Casmurro', author: 'Machado de Assis', status: BookStatus.FINISHED, description: 'Clássico da literatura brasileira sobre ciúme e desconfiança.' },
    { title: 'O Cortiço', author: 'Aluísio Azevedo', status: BookStatus.READING, description: 'Romance naturalista que retrata a vida em um cortiço no Rio de Janeiro.' },
    { title: '1984', author: 'George Orwell', status: BookStatus.FINISHED, description: 'Distopia sobre totalitarismo e vigilância.' },
    { title: 'Brave New World', author: 'Aldous Huxley', status: BookStatus.WISHLIST, description: 'Sociedade futurista controlada por tecnologia e drogas.' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: BookStatus.FINISHED, description: 'Retrato da sociedade americana dos anos 1920.' },
    
    // Technology
    { title: 'Clean Code', author: 'Robert C. Martin', status: BookStatus.READING, description: 'Princípios e práticas para escrever código limpo e maintível.' },
    { title: 'Design Patterns', author: 'Gang of Four', status: BookStatus.FINISHED, description: 'Padrões de design reutilizáveis em software orientado a objetos.' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', status: BookStatus.WISHLIST, description: 'Guia prático para desenvolvimento de software eficaz.' },
    { title: 'System Design Interview', author: 'Alex Xu', status: BookStatus.READING, description: 'Guia completo para entrevistas de system design.' },
    
    // Science
    { title: 'Sapiens', author: 'Yuval Noah Harari', status: BookStatus.FINISHED, description: 'História da humanidade desde a pré-história até hoje.' },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', status: BookStatus.READING, description: 'Teoria evolutiva centrada nos genes.' },
    { title: 'Cosmos', author: 'Carl Sagan', status: BookStatus.WISHLIST, description: 'Exploração do universo e nosso lugar nele.' },
    
    // Philosophy  
    { title: 'Meditations', author: 'Marcus Aurelius', status: BookStatus.FINISHED, description: 'Reflexões filosóficas do imperador romano.' },
    { title: 'The Republic', author: 'Plato', status: BookStatus.READING, description: 'Diálogos sobre justiça e a cidade ideal.' },
    
    // Business
    { title: 'The Lean Startup', author: 'Eric Ries', status: BookStatus.FINISHED, description: 'Metodologia para criar empresas inovadoras.' },
    { title: 'Zero to One', author: 'Peter Thiel', status: BookStatus.WISHLIST, description: 'Como construir empresas que criam coisas novas.' },
    
    // Self-help
    { title: 'Atomic Habits', author: 'James Clear', status: BookStatus.READING, description: 'Como pequenas mudanças podem gerar grandes resultados.' },
    { title: 'The 7 Habits', author: 'Stephen Covey', status: BookStatus.FINISHED, description: 'Princípios para eficácia pessoal e profissional.' },
    
    // Brazilian authors
    { title: 'Cidade de Deus', author: 'Paulo Lins', status: BookStatus.WISHLIST, description: 'Retrato da violência urbana no Rio de Janeiro.' },
    { title: 'O Quinze', author: 'Rachel de Queiroz', status: BookStatus.FINISHED, description: 'Romance sobre a seca no nordeste brasileiro.' }
  ]

  // Distribute books among users
  let bookIndex = 0
  for (const user of createdUsers) {
    const userBooks = booksData.slice(bookIndex, bookIndex + 7) // Each user gets 7 books
    
    for (const bookData of userBooks) {
      await prisma.book.create({
        data: {
          title: bookData.title,
          author: bookData.author,
          status: bookData.status,
          description: bookData.description,
          userId: user.id
        }
      })
      console.log(`📚 Created book: "${bookData.title}" by ${bookData.author} for ${user.name}`)
    }
    
    bookIndex += 7
    if (bookIndex >= booksData.length) bookIndex = 0 // Reset if we run out of books
  }

  // Extract unique authors and create Author records
  const uniqueAuthors = [...new Set(booksData.map(book => book.author))]
  
  for (const authorName of uniqueAuthors) {
    const slug = authorName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const booksCount = booksData.filter(book => book.author === authorName).length
    
    await prisma.author.upsert({
      where: { name: authorName },
      update: { booksCount },
      create: {
        name: authorName,
        slug,
        booksCount,
        bio: `Biografia de ${authorName} - autor de ${booksCount} livro${booksCount > 1 ? 's' : ''} em nossa base.`,
        isVerified: ['George Orwell', 'Machado de Assis', 'Carl Sagan'].includes(authorName)
      }
    })
    console.log(`✍️  Created author: ${authorName} (${booksCount} books)`)
  }

  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })