class Demo:
    def __init__(self):
        print("Demo class initialized")
    
    def __call__(self):
        print("Demo class called")
        return self

demo = Demo()

async def singleton_demo():
    return demo