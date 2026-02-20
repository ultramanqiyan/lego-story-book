const { execSync } = require('child_process')

jest.setTimeout(30000)

async function executeD1Query(sql) {
    try {
        const result = execSync(
            `npx wrangler d1 execute lego-story-db --command "${sql.replace(/"/g, '\\"')}" --remote --json`,
            { cwd: process.cwd(), encoding: 'utf-8', timeout: 30000 }
        )
        return JSON.parse(result)
    } catch (error) {
        console.error('D1 Query Error:', error.message)
        throw error
    }
}

global.executeD1Query = executeD1Query

beforeAll(async () => {
    console.log('Connecting to Cloudflare D1 database...')
})

afterAll(async () => {
    console.log('Integration tests completed.')
})
