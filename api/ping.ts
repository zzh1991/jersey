export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }))
}