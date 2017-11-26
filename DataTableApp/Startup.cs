using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DataTableApp.Startup))]
namespace DataTableApp
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
