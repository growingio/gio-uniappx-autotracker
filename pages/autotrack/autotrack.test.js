const PAGE_PATH = '/pages/autotrack/autotrack'

describe('autotrack method reference event forwarding', () => {
  let page

  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('#method_ref_event')
  })

  it('forwards $event to a one-argument method reference', async () => {
    const button = await page.$('#method_ref_event')
    await button.tap()
    await page.waitFor(async () => {
      const result = await page.$('#method_ref_event_result')
      return (await result.text()) === '$event received'
    })
    const result = await page.$('#method_ref_event_result')
    expect(await result.text()).toBe('$event received')
  })

  it('keeps a zero-argument method reference callable', async () => {
    const button = await page.$('#method_ref_zero')
    await button.tap()
    await page.waitFor(async () => {
      const result = await page.$('#method_ref_zero_result')
      return (await result.text()) === 'zero argument called'
    })
    const result = await page.$('#method_ref_zero_result')
    expect(await result.text()).toBe('zero argument called')
  })

  it('forwards $event to a member method reference', async () => {
    const button = await page.$('#method_ref_member')
    await button.tap()
    await page.waitFor(async () => {
      const result = await page.$('#method_ref_member_result')
      return (await result.text()) === 'member $event received'
    })
    const result = await page.$('#method_ref_member_result')
    expect(await result.text()).toBe('member $event received')
  })
})
