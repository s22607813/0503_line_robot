import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import cheerio from 'cheerio'

dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動s111')
})

bot.on('message', async event => {
  console.log(event.message.type)
  if (event.message.type === 'text') {
    try {
      const response = await axios.get(`https://www.bookwalker.com.tw/search?w=${encodeURI(event.message.text)}`)
      const $ = cheerio.load(response.data)
      const flex = {
        type: 'bubble',
        hero: {
          type: 'image',
          url: $('.bwbook_package .bookbor').eq(0).attr('data-src'),
          size: 'md',
          aspectRatio: '106:149',
          aspectMode: 'fit',
          action: {
            type: 'uri',
            uri: $('.bwbookitem a').eq(0).attr('href')
          },
          offsetTop: 'md',
          offsetBottom: 'md'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: $('.bwbook_package .bookname').eq(0).text(),
              weight: 'bold',
              size: 'xl',
              wrap: true
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: $('.bwbook_package .booknamesub').eq(0).text(),
                      color: '#aaaaaa',
                      size: 'xs',
                      flex: 1,
                      align: 'start'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: $('.bwbook_package .bprice').eq(0).text(),
                      color: '#ff0000',
                      size: 'sm',
                      flex: 1,
                      align: 'center'
                    }
                  ]
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'link',
              height: 'sm',
              action: {
                type: 'uri',
                label: '連結',
                uri: $('.bwbookitem a').eq(0).attr('href')
              }
            },
            {
              type: 'spacer',
              size: 'sm'
            }
          ],
          flex: 0
        }
      }
      console.log(event.reply)
      event.reply({
        type: 'flex',
        altText: $('.bwbook_package .bookname').eq(0).text(),
        contents: {
          type: 'carousel',
          contents: [flex]
        }
      })
    } catch (error) {
      console.log('失敗')
      console.log(error)
    }
  }
})
